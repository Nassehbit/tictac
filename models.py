from server import db

class User(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    rank_score = db.Column(db.String())
   

    def __init__(self, name, author, published):
        self.name = name
        self.author = author
        self.published = published

    def __repr__(self):
        return '<id {}>'.format(self.id)
    
    def serialize(self):
        return {
            'id': self.id, 
            'name': self.username,
            'author': self.rank_score
        }