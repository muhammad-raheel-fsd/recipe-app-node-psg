const HeroBanner = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-3 gap-10">
            <div>
                <h1>RECIPEDIA</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, quis!</p>
            </div>

            <div className="col-span-2 border-2 border-blue-600 rounded-2xl">
            <img className="w-full h-40 bg-blue-100 max-w-full rounded-2xl"
            src="https://images.pexels.com/photos/7788414/pexels-photo-7788414.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="gallery-photo" />
            </div>
        </div>
    )
}

export default HeroBanner
