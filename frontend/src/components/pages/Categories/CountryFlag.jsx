import ReactCountryFlag from "react-country-flag"
import { Link } from "react-router-dom"

const CountryFlag = ({ countryCode, title }) => {
    return (
        <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
            }}
            title={title}
        />
    )
}

export default CountryFlag
