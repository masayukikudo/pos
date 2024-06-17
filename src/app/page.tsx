'use client';

import { useState } from 'react';

export default function Home() {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<{ name: string, code: string, price: number } | null>(null);
  const [purchaseList, setPurchaseList] = useState<{ name: string, code: string, price: number, quantity: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string, code: string, price: number, quantity: number } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityPopup, setShowQuantityPopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleScan = async () => {
    try {
      // カメラ機能の実装
      const video = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // バーコードをスキャンするロジックを実装（ここでは擬似的にバーコードを設定）
      // 実際にはバーコードリーダーなどのライブラリを使用してバーコードを読み取ります
      const scannedCode = "example-code"; // 実際にはカメラから取得したバーコードをここに設定
      setBarcode(scannedCode);

      // 商品マスタに問い合わせ
      const product = await queryProductMaster(scannedCode);
      setProduct(product);
      if (product) {
        const existingProductIndex = purchaseList.findIndex(item => item.code === product.code);
        if (existingProductIndex >= 0) {
          // 既存の商品を更新
          const updatedList = [...purchaseList];
          updatedList[existingProductIndex].quantity += 1;
          setPurchaseList(updatedList);
        } else {
          // 新しい商品を追加
          setPurchaseList([...purchaseList, { ...product, quantity: 1 }]);
        }
      }
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        alert('カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。');
      } else {
        console.error('Error accessing the camera', error);
      }
    }
  };

  const queryProductMaster = async (code: string) => {
    // ここで商品マスタに問い合わせる処理を実装
    // 例として、固定のデータを返す
    if (code === "example-code") {
      return { name: "Sample Product", code, price: 1000 };
    } else {
      return null;
    }
  };

  const handleRemoveProduct = () => {
    if (selectedProduct) {
      const updatedList = purchaseList.filter(item => item.code !== selectedProduct.code);
      setPurchaseList(updatedList);
      setSelectedProduct(null);
      setProduct(null);
      setBarcode('');
      setQuantity(1);
    }
  };

  const handleQuantityChange = () => {
    setShowQuantityPopup(true);
  };

  const handleQuantityUpdate = () => {
    if (quantity < 1 || quantity > 99) {
      setErrorMessage('数量は1~99までの値を選択してください');
    } else {
      if (selectedProduct) {
        const updatedList = purchaseList.map(item => 
          item.code === selectedProduct.code ? { ...item, quantity } : item
        );
        setPurchaseList(updatedList);
        setShowQuantityPopup(false);
        setSelectedProduct(null);
        setProduct(null);
        setBarcode('');
        setQuantity(1); // 数量をクリア
        setErrorMessage('');
      }
    }
  };

  const handleSelectProduct = (product) => {
    setBarcode(product.code);
    setProduct(product);
    setSelectedProduct(product);
    setQuantity(product.quantity);
  };

  const handlePurchase = () => {
    const total = purchaseList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
    // DBへ保存処理
    // 保存処理をここに追加
  };

  const handleClosePopup = () => {
    setTotalPrice(0);
    setPurchaseList([]);
    setProduct(null);
    setBarcode('');
    setQuantity(1);
  };

  const calculateTotal = () => {
    const total = purchaseList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-white">
      <div className="w-full max-w-md">
        <button onClick={handleScan} className="bg-blue-500 text-white w-full py-2 rounded mb-4">スキャン（カメラ）</button>
        <div className="mb-4">
          <label className="block mb-1">バーコード:</label>
          <input type="text" value={barcode} readOnly className="border rounded w-full px-2 py-1" />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">単価:</label>
            <input type="text" value={product ? `¥${product.price}` : ''} readOnly className="border rounded w-full px-2 py-1" />
          </div>
          <div className="flex-1">
            <label className="block mb-1">数量:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" max="99" className="border rounded w-full px-2 py-1" />
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <button onClick={handleRemoveProduct} className="bg-red-500 text-white w-full py-2 rounded">リスト削除</button>
          <button onClick={handleQuantityChange} className="bg-yellow-500 text-white w-full py-2 rounded">数量変更</button>
        </div>
        <h2 className="text-xl mb-2 text-center">購入リスト:</h2>
        <div className="mb-4 border p-4 rounded">
          <ul className="list-none pl-0">
            {purchaseList.map((item, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <div>
                  {item.name} - {item.quantity}個 - ¥{item.price} - 合計: ¥{item.price * item.quantity}
                </div>
                <button onClick={() => handleSelectProduct(item)} className="bg-gray-200 text-black px-2 py-1 rounded ml-4">↑</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>合計:</div>
          <div className="border p-2 rounded">
            税込: ¥{calculateTotal()} 税抜: ¥{Math.round(calculateTotal() / 1.1)}
          </div>
        </div>
        <button onClick={handlePurchase} className="bg-red-500 text-white w-full py-2 rounded">購入</button>
      </div>
      {totalPrice > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded">
            <h2 className="text-2xl mb-4">合計金額</h2>
            <p>税込: ¥{totalPrice}</p>
            <p>税抜: ¥{Math.round(totalPrice / 1.1)}</p>
            <button onClick={handleClosePopup} className="bg-blue-500 text-white w-full py-2 rounded mt-4">OK</button>
          </div>
        </div>
      )}
      {showQuantityPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded">
            <h2 className="text-2xl mb-4">数量変更</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <input 
              type="number" 
              min="1" 
              max="99" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))} 
              className="w-full mb-4 border p-2 rounded"
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowQuantityPopup(false)} className="bg-gray-500 text-white w-full py-2 rounded">×</button>
              <button onClick={handleQuantityUpdate} className="bg-blue-500 text-white w-full py-2 rounded">更新</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
