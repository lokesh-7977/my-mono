// padded={false} crops the canvas to the glyph so it fills its box; the default keeps the original inset.
function Altitude({ height = "50px", width = "50px", color = "black", bg = "transparent", padded = true }) {
    return (
        <div style={{ height, width, color }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={padded ? "0 0 51 51" : "10 15 31 21"} fill="none">
                {padded && <rect x="0.5" y="0.5" width="50" height="50" rx="10" fill={bg}></rect>}
                <path d="M11.8 34.6L21.3 18.7L24 22.2L27.7 16.5L39.2 34.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"></path>
                <path d="M16.8 27.8C18.2 26.4 19.6 26.4 21 27.4C22.4 28.4 23.8 28.4 25.2 27.4C26.6 26.4 28 26.4 29.4 27.4C30.8 28.4 32.2 28.4 33.6 27.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path>
            </svg>
        </div>
    );
}

export default Altitude;
