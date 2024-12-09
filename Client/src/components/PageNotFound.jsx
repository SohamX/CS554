import pageNotFoundImage from './../assets/pageNotFound.png';

function PageNotFound() {
    return (
        <>
            <h1>Page Not Found.!</h1>
            <img src={pageNotFoundImage} alt="Page Not Found" />
        </>
    )
}

export default PageNotFound;