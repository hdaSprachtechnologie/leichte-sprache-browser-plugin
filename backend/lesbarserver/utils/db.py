"""Access the mongo db."""
import logging

import pymongo

log = logging.getLogger(__name__)


class Db():
    """Provide handy methods for the mongo db."""

    def __init__(self, host='localhost', port=27017, user=None, password=None):
        """Connect to the db 'leichtesprache' and select the collection 'lexicon'."""
        url = 'mongodb://%s:%i/' % (host, port)
        log.debug('try to connect to %s', url)
        self.__conn = pymongo.MongoClient(url)
        self.__db = self.__conn.leichtesprache
        self.__collection = self.__db.lexicon
        log.debug('connected to db successfully')

    def fetch_desc(self, word):
        """Try to find an easy synonym for 'word' within the db.

        returns the easy synonym if found, empty string otherwise.
        """
        row = self.__collection.find_one({"word": word})
        if row is None:
            return ""
        else:
            return row["desc"]
