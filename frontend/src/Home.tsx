import './style/Home.css';

export function Home() {
    return (
        <div className="home">
            <div className="home-header">
                <h1 className='home-title'>Welcome to the Home Page</h1>
            </div>
            <p className='home-details'>This application allows you to record your spending, view a list of expenses, and see each expense automatically categorized. 
                The goal is to make basic expense tracking simple and easy to use.
            </p>
        </div>
            
    );
}