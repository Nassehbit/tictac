import server

class User(server.db.Model):
    __tablename__ = 'user'

    id = server.db.Column(server.db.Integer, primary_key=True)
    username = server.db.Column(server.db.String())
    rank_score = server.db.Column(server.db.Integer())
   

    def __init__(self, username, rank_score):
        self.username = username
        self.rank_score = rank_score
       

