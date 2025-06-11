import '../../styles/form.scss'
const AddProduct = () =>{
    return (
        <>
            <div className="container">
                <h2>Add New Product</h2>
                <form action="">
                    <div>
                        <label>Product Name</label>
                        <input type="text" required/>
                    </div>
                    <div>
                        <label>Product Description</label>
                        <input type="text" required/>
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input type="number" required/>
                    </div>
                    <div>
                        <label>Price</label>
                        <input type="number" required/>
                    </div>
                </form>
            </div>
        </>)

}

export default AddProduct