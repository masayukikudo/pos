from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from db_control.crud import get_product_by_code, get_all_products, create_purchase

app = FastAPI()

# CORS設定の追加
origins = [
    "https://localhost",
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductModel(BaseModel):
    prd_id: Optional[int] = None
    code: str
    name: str
    price: float

class PurchaseModel(BaseModel):
    code: str
    name: str
    price: float
    quantity: int
    total_amount: float
    datetime: datetime  # datetimeフィールドを追加

@app.get("/search_product/", response_model=ProductModel)
async def search_product(code: str) -> Optional[ProductModel]:
    product = get_product_by_code(code)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/products/", response_model=List[ProductModel])
async def get_products() -> List[ProductModel]:
    products = get_all_products()
    if not products:
        raise HTTPException(status_code=404, detail="No products found")
    return products

@app.post("/purchase/", response_model=PurchaseModel)
async def create_purchase_endpoint(purchase: PurchaseModel):
    created_purchase = create_purchase(purchase)
    return created_purchase
