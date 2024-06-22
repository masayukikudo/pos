from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

Base = declarative_base()
main_path = os.path.dirname(os.path.abspath(__file__))
path = os.chdir(main_path)
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

class Purchase(Base):
    __tablename__ = 'Purchases'

    id = Column(Integer, primary_key=True)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    datetime = Column(DateTime, default=datetime.utcnow, nullable=False)  # datetimeのdefault値を設定
    total_amount = Column(Float, nullable=False)

    def __repr__(self):
        return f'<Purchase {self.id}>'

