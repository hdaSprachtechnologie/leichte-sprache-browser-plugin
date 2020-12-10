"""Sets up logging and starts the rest server."""

import logging

from lesbarserver import config
from lesbarserver.utils import api


def main():
    """Set up logging to a file (based on config.py) and start rest server."""
    if config.DEBUG:
        loglevel = logging.DEBUG
    else:
        loglevel = logging.ERROR
    logging.basicConfig(filename=config.LOGFILE, level=loglevel)
    logging.basicConfig(
        filename=config.LOGFILE,
        format='%(asctime)s: %(name)s - %(levelname)s - %(message)s',
        datefmt='%y-%b-%d %H:%M:%S'
    )
    api.start_server()

if __name__ == '__main__':
    main()
