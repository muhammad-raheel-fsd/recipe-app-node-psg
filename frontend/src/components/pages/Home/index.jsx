import SectionWrapper from '../../common/SectionWrapper'
import Recipes from '../Recipes'
import Search from './Search'
const Home = () => {
  return (
    <SectionWrapper>
      <Search />
      <Recipes />
    </SectionWrapper>
  )
}

export default Home