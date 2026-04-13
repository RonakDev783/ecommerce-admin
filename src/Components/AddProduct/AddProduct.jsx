import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  // 🔥 multiple images
  const [images, setImages] = useState([])

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    public_id: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  // 🔥 multiple files handler
  const imageHandler = (e) => {
    setImages([...e.target.files]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  // 🔥 MAIN FUNCTION (UPDATED)
  const Add_Product = async () => {

    if (images.length === 0) {
      alert("Please select images");
      return;
    }

    for (let i = 0; i < images.length; i++) {

      let formData = new FormData();
      formData.append('product', images[i]);

      // 🟢 Upload image
      let responseData = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());

      if (responseData.success) {

        let product = {
          ...productDetails,
          image: responseData.image_url,
          public_id: responseData.public_id,
        };

        // 🟢 Add product
        await fetch(`${import.meta.env.VITE_API_URL}/addproduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
      }
    }

    alert("All Products Added 🔥");
  }

  return (
    <div className='add-product'>

      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={images.length > 0 ? URL.createObjectURL(images[0]) : upload_area} className="addproduct-thumnail-img" alt="" />
        </label>

        {/* 🔥 MULTIPLE FILE INPUT */}
        <input onChange={imageHandler} type="file" name='image' id='file-input' multiple hidden />
      </div>

      <button onClick={() => { Add_Product() }} className='addproduct-btn'>
        ADD One / Multiple
      </button>

    </div>
  )
}

export default AddProduct