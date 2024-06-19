from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from db_control.crud import get_product_by_code

app = FastAPI()

class ProductModel(BaseModel):
    prd_id: Optional[int] = None
    code: str
    name: str
    price: float

@app.get("/search_product/", response_model=ProductModel)
async def search_product(code: str) -> Optional[ProductModel]:
    print('テスト')
    product = get_product_by_code(code)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    print(product)
    return product

