from sqlalchemy.orm import sessionmaker
from .mymodels import Purchase, Product, engine

# セッションの作成
SessionLocal = sessionmaker(bind=engine)

def create_purchase(purchase_data):
    session = SessionLocal()
    try:
        purchase = Purchase(
            code=purchase_data.code,
            name=purchase_data.name,
            price=purchase_data.price,
            quantity=purchase_data.quantity,
            total_amount=purchase_data.total_amount,
            datetime=purchase_data.datetime  # datetimeを追加
        )
        session.add(purchase)
        session.commit()
        session.refresh(purchase)
        return purchase
    finally:
        session.close()

def get_product_by_code(code: str):
    session = SessionLocal()
    try:
        return session.query(Product).filter(Product.code == code).first()
    finally:
        session.close()

def get_all_products():
    session = SessionLocal()
    try:
        return session.query(Product).all()
    finally:
        session.close()
