export default function SideBar () {

    const handleClickAddCategory  = () => {
        
    }

    return (
        <div className="sidebar">
        <h3 className="headtitle">📘 My Vocabulary</h3>
        <button className="buttonSidebar" onClick={handleClickAddCategory}>+ New Category</button>
        <h3> 🏡 Daily Life</h3>
        </div>
    )
}