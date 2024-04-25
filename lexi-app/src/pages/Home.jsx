import Banner from "../components/Banner"
import NewsBanner from "../NewsBanner"
import SecondBanner from "../SecondBanner"
import FinalBanner from "../components/FinalBanner"
import Footer from "../components/Footer"

export default function Home () {
    return <div>
    <Banner />
    <NewsBanner />
    <SecondBanner />
    <FinalBanner />
    <Footer></Footer>
    </div>
}