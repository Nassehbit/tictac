
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    SQLALCHEMY_DATABASE_URI ="postgresql://postgres:torta@localhost/tictac"
    # SQLALCHEMY_DATABASE_URI='postgres://yqspcryeghkkjk:5df9859543199171ef1b14904f595cf6852dbf67332aa29f4359148979bf25c6@ec2-34-239-33-57.compute-1.amazonaws.com:5432/d2i1ad40d0fp9r'


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True