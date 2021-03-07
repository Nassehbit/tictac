
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    # SQLALCHEMY_DATABASE_URI ="postgresql://postgres:torta@localhost/tictac"
    SQLALCHEMY_DATABASE_URI='postgres://vmnlusmwgtyrhw:36fd8cc934ceda0892649e9121e971395708252426e2d1ce1710b13dd7f3b739@ec2-54-166-242-77.compute-1.amazonaws.com:5432/dcj27fd9qrocvt'


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