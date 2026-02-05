import './style/Spendings.css';

function Spendings() {
    return (
        <div>
            <h1 className="spendings-title">Spendings Page</h1>
            {/* Add your spendings content here */}
            <header className="top-bar">
            <button className="add-expense-btn">
                + Add New Expense
                </button>
            </header>
        </div>
    );
}

export default Spendings;