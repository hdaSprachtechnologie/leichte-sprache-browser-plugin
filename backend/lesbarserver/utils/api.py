"""Uses tornado to provide a rest service (async)."""

import logging
from concurrent.futures import ThreadPoolExecutor

from tornado import escape, gen, httpclient, ioloop, web
from tornado.concurrent import run_on_executor

from lesbarserver import config
from lesbarserver.utils import db, status, strategy

log = logging.getLogger(__name__)


class AsyncMainHandler(web.RequestHandler):
    """Handles general request to the server, i.e. a simple get to the server itself, basically for testing."""

    SUPPORTED_METHODS = ("GET")

    def get(self):
        """Handle simple get call, without any agruments."""
        self.set_status(status.HTTP_200_OK)
        self.write("Einfache Sprache works")


class AsyncEasyWordListHandler(web.RequestHandler):
    """Checks for easy language for a list of words."""

    SUPPORTED_METHODS = ("POST")

    def initialize(self, strategyHandler):
        """Set the strategy handler."""
        self.__strategy_handler = strategyHandler

    def prepare(self):
        """Call at the beginning of a request before get/post/etc."""
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.data = escape.json_decode(self.request.body)
        else:
            self.data = None

    async def post(self):
        """Async handling of post requests with a list of words as json."""
        log.debug("handle post request for easywordlist")
        easy_dictionary = []
        log.debug(self.__strategy_handler)
        try:
            easy_dictionary = await self.fetch_easy()
            response = {'replacements': easy_dictionary}
            self.set_status(status.HTTP_200_OK)
            self.set_header('Content-Type', 'application/json')
        except Exception as e:
            log.exception('Exception in handling request %s with post body %s', self.request, self.request.body)
            response = ""
            self.set_status(status.HTTP_400_BAD_REQUEST)
        log.debug("return response %s --- done.", response)
        self.write(response)

    async def fetch_easy(self):
        """Async method to fetch the easy words using the provided strategies."""
        words = list(dict.fromkeys(self.data))  # remove doubles
        easy_replacements = []
        for word in words:
            easy = self.__strategy_handler.execute(word)
            if (len(easy) > 0):
                easy_replacements.append({'org': word, 'easy': easy})
        return easy_replacements


class Application(web.Application):
    """Main Application."""

    def __init__(self, **kwargs):
        """Initialize routes and strategies."""
        dbo = db.Db(config.DBHOST, config.DBPORT)
        strategyHandler = ini_strategy_handler(dbo)
        handlers = [
            (r"/", AsyncMainHandler),
            (r"/easywordlist", AsyncEasyWordListHandler, {'strategyHandler': strategyHandler})
        ]
        super(Application, self).__init__(handlers, **kwargs)


def ini_strategy_handler(db):
    """Define strategy handlers, currently we use the database and compound syllables of nlp."""
    strategyHandler = strategy.StrategyHandler()
    strategyHandler.addStrategy(strategy.DbStrategy(db))
    strategyHandler.addStrategy(strategy.NlpStrategy())
    return strategyHandler


def start_server():
    """Start the server."""
    try:
        application = Application(debug=config.DEBUG)
        port = config.PORT
        print("Listening at port {0}".format(port))
        application.listen(port)
        tornado_ioloop = ioloop.IOLoop.instance()
        periodic_callback = ioloop.PeriodicCallback(lambda: None, 500)  # allow ctrc-c to stop
        periodic_callback.start()
        tornado_ioloop.start()
    except Exception as e:
            log.exception('Exception - could not start server')
            print('error: could not start server')


if __name__ == '__main__':
    start_server()
