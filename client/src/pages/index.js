import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import {
  Link as ChakraLink, List,
  ListIcon,
  ListItem, Text
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { CTA } from '../components/CTA'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Main } from '../components/Main'

const Index = () => (
  <Container height="100vh">
    <Hero />
    <Main>

      <List spacing={3} my={0}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink
            isExternal
            href="https://chakra-ui.com"
            flexGrow={1}
            mr={2}
          >
            Chakra UI <LinkIcon />
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
            Next.js <LinkIcon />
          </ChakraLink>
        </ListItem>
      </List>
    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>Next ❤️ Chakra</Text>
    </Footer>
    <CTA />
  </Container>
)

export default Index
