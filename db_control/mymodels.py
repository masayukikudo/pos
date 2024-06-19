from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os


Base = declarative_base()
print("Current working directory:", os.getcwd())
main_path = os.path.dirname(os.path.abspath(__file__))
path = os.chdir(main_path)
print(path)
print("Current working directory:", os.getcwd())
engine = create_engine('sqlite:///Commerce.db', echo=True)
Session = sessionmaker(bind=engine)

class Product(Base):
    __tablename__ = 'Products'

    prd_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)

    def __repr__(self):
        return f'<Product {self.prd_id}>'