"""Strategy pattern with multiple strategies."""
import abc  # needed for abstract classes in Python
import logging

from lesbarserver.nlp import compounds_syllables as nlp
from lesbarserver.nlp import nouns

log = logging.getLogger(__name__)


class AbstractStrategy(metaclass=abc.ABCMeta):
    """Abstract class for strategy pattern."""

    @abc.abstractmethod
    def fetch_easy_word(self, word):
        """Implement this method by each strategy."""
        pass


class StrategyHandler:
    """Handle multiple strategies."""

    def __init__(self):
        """Initialize with no strategies."""
        self.strategies = []

    def addStrategy(self, strategy):
        """Add a strategy.

        :param strategy: strategy to be added
        :type strategy: AbstractStrategy, e.g. must contain method fetch_easy_word
        """
        log.debug('add strategy of type %s', type(strategy))
        method = getattr(strategy, "fetch_easy_word", None)
        if callable(method):
            self.strategies.append(strategy)
        else:
            raise Exception(SyntaxError, "not of type AbstractStrategy")

    def execute(self, word):
        """Execute all strategies in the order provided by add.

        :param word: word to be looked up
        :type word: string
        :return: if one succeeds return the found word, else return ''
        :rtype: string
        """
        for strategy in self.strategies:
            easy = strategy.fetch_easy_word(word)
            if len(easy) > 0:
                return easy
        return ""  # no easy word found for word


class DbStrategy(AbstractStrategy):
    """Fetch easy synonyms from db."""

    def __init__(self, db):
        """Construct.

        :param db: connection to the database
        :type db: class Db
        """
        self.db = db

    def fetch_easy_word(self, word):
        """Fetch easy synonym for 'word' from db."""
        return self.db.fetch_desc(word)


class NlpStrategy():
    """Find easy explanations using nlp."""

    def fetch_easy_word(self, word):
        """Construct easy synonym for 'word' using nlp methods."""
        parts = nlp.analyze_compound_syls(word)
        if len(parts) > 1:
            separator = '·'
            return separator.join(parts)
        else:
            return ""
