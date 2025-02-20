import '../../public/css/bootstrap.min.css';
import '../../public/css/style.css';
import '../../public/css/responsive.css';
import Head from 'next/head';



const Header = () => {
    return (
      <>
      <Head>
        <title>Navigation</title>
        <link rel="stylesheet" href="../../public/css/bootstrap.min.css" />
        <link rel="stylesheet" href="../../public/css/style.css" />
        <link rel="stylesheet" href="../../public/css/responsive.css" />
      </Head>
      <header className="text-gray-800 bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/"><h1 className="text-xl font-bold">Epitome Consulting</h1>ß</a>
          <nav>
            <ul className="navigation">
              <li><a href="/" className="text-gray-700 hover:text-blue-500 active">Home</a></li>
              <li><a href="/about" className="text-gray-700 hover:text-blue-500 active">About</a></li>
              <li><a href="/contact" className="text-gray-700 hover:text-blue-500">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      </>
    );
  };
  
  export default Header;
  