from .mymodels import Session, Product

def get_product_by_code(code: str):
    session = Session()
    try:
        product = session.query(Product).filter(Product.code == code).first()
        return product
    finally:
        session.close()