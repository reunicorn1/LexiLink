import { useLocation } from "react-router-dom"

export default function Payment() {
    const location = useLocation();
    
    console.log(location.state);
    
    return <h1>This is payment</h1>
}