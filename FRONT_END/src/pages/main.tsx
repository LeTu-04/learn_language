interface MainContentProps {
    toogleSidebar : () => void
}

export default function MainContent ({toogleSidebar} : MainContentProps) {
    return (
        <div className="main">
            <button className="buttonToogleSidebar" onClick={toogleSidebar}>≡</button>
            <h2 className="CategoryVocabName">Category : DailyLife</h2>
            <p>You have 1 word 💫</p>
            <div className="card">
                <h3 className="word"> Commute</h3>
                <p className="meaning"> Đi lại</p>
                <small className="example">I commute to school by bus</small>
            </div>
        </div>
    )
}