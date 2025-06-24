import '../../styles/navbar.scss'
const Navbar = () => {
    return <>
        <div className="navbar">
            <div className="nav-logo">IMS</div>
            <div className="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/product">Product</a>
                <a href="/issue-product">Issue Product</a>
                <a href="/category">Category</a>
                <a href="/users">Staff</a>
                <a href="/login">Login</a>
                <a href="/deprtments">Department</a>
            </div>
        </div>

    </>
}
export default Navbar;