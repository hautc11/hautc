import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { getETHPrice, getWEIPriceInVND } from "../lib/getETHPrice";
import {
  Heading,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
  Divider,
  Skeleton,
  Img,
  Icon,
  chakra,
  Tooltip,
  SkeletonCircle,
  HStack,
  Stack,
  Progress,
  VStack,
} from "@chakra-ui/react";

import factory from "../smart-contract/factory";
import web3 from "../smart-contract/web3";
import Campaign from "../smart-contract/campaign";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  console.log(campaigns);

  return {
    props: { campaigns },
  };
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("gray.100", "gray.700")}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Stack>
  );
};

const Milestone = ({ title, number, descriptionText }) => {
  return (
    <Stack>
      <Text 
        fontWeight={"600"}
        fontSize={"20px"}>
          {title}
      </Text>
      <Text 
        fontWeight={"900"}
        fontSize={"35px"}
        color={useColorModeValue("orange.400", "orange.500")}>
          {number}
      </Text>
      <Text 
        fontSize={"16px"} 
        color={useColorModeValue("gray.500", "gray.200")}>
          {descriptionText}
      </Text>
    </Stack>
  );
};

function CampaignCard({
  name,
  description,
  creatorId,
  imageURL,
  id,
  balance,
  target,
  ethPrice,
}) {
  return (
    <NextLink href={`/campaign/${id}`}>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        maxW={{ md: "sm" }}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition={"transform 0.3s ease"}
        _hover={{
          transform: "translateY(-8px)",
        }}
      >
        <Box height="18em">
          <Img
            src={imageURL}
            alt={`Picture of ${name}`}
            roundedTop="lg"
            objectFit="cover"
            w="full"
            h="full"
            display="block"
          />
        </Box>
        <Box p="6">
          <Flex
            mt="1"
            justifyContent="space-between"
            alignContent="center"
            py={2}
          >
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {name}
            </Box>

            <Tooltip
              label="Contribute"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1.2em"}
            >
              <chakra.a display={"flex"}>
                <Icon
                  as={FaHandshake}
                  h={7}
                  w={7}
                  ml={2}
                  alignSelf={"center"}
                  color={"purple.400"}
                />{" "}
              </chakra.a>
            </Tooltip>
          </Flex>
          <Flex alignContent="center" py={2}>
            {" "}
            <Text color={"gray.500"} pr={2}>
              by
            </Text>{" "}
            <Heading size="base" isTruncated>
              {creatorId}
            </Heading>
          </Flex>
          <Flex direction="row" py={2}>
            <Box w="full">
              <Box
                fontSize={"2xl"}
                isTruncated
                maxW={{ base: "	15rem", sm: "sm" }}
                pt="2"
              >
                <Text as="span" fontWeight={"bold"}>
                  {balance > 0 ? web3.utils.fromWei(balance, "ether") : "0 ETH"}
                </Text>
                <Text
                  as="span"
                  display={balance > 0 ? "inline" : "none"}
                  pr={2}
                  fontWeight={"bold"}
                >
                  {" "}
                  ETH
                </Text>
                <Text
                  as="span"
                  fontSize="lg"
                  display={balance > 0 ? "inline" : "none"}
                  fontWeight={"normal"}
                  color={useColorModeValue("gray.500", "gray.200")}
                >
                  ({getWEIPriceInVND(ethPrice, balance)})
                </Text>
              </Box>

              <Text fontSize={"md"} fontWeight="normal">
                target of {web3.utils.fromWei(target, "ether")} ETH (
                {getWEIPriceInVND(ethPrice, target)})
              </Text>
              <Progress
                hasStripe
                colorScheme={"purple"}
                size="sm"
                value={web3.utils.fromWei(balance, "ether")}
                max={web3.utils.fromWei(target, "ether")}
                mt="2"
              />
            </Box>{" "}
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function Home({ campaigns }) {
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) =>
          Campaign(campaigns[i]).methods.getSummary().call()
        )
      );
      const ETHPrice = await getETHPrice();
      updateEthPrice(ETHPrice);
      console.log("summary ", summary);
      setCampaignList(summary);

      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div>
      <Head>
        <title>BlockFund</title>
        <meta
          name="description"
          content="Transparent Crowdfunding in Blockchain"
        />
        /*set logo here*/
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={"1"} maxW={"7xl"} align={"left"}>
          <Flex flexDirection="row" alignItems={"center"} justifyContent={"space-between"}>
            {/* Here is text section in home page */}
            <VStack align={"left"}>
              <Heading
                fontFamily={"heading"}
                color={useColorModeValue("gray.800", "white")}
                as="h1"
                lineHeight={"45px"}
              >
                Crowdfunding using the powers of
                <br />
                <Text
                  color={useColorModeValue("orange.400", "orange.500")}
                  fontFamily={"heading"}
                >
                  Crypto & Blockchain
                </Text>
                <Text fontSize={"xl"} mt={"2.5"}>
                  "Transparent - Global - Private"
                </Text>
              </Heading>
              {/* This is button */}
              <NextLink href="/campaign/new">
                <Button
                  display={{ sm: "inline-flex" }}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"purple.400"}
                  _hover={{
                    bg: "purple.300",
                  }}
                >
                  Create a Campaign
                </Button>
              </NextLink>
            </VStack>

            <VStack>
              <Img
                    src="/static/img_crypto.png"
                    alt="no-request"
                    layout="fill"
                  />
            </VStack>
          </Flex>
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2}>
            <Box
                as={"span"}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: "-13px",
                  bottom: "-4px",
                  borderRadius:"50px",
                  w: "46px",
                  h: "46px",
                  bg: useColorModeValue("purple.300", "purple.900"),
                  zIndex: -1,
                }}
              >
                <Heading as="h2" size="lg">
                  Open Campaigns
                </Heading>
              </Box>
          </HStack>
          <Divider marginTop="4" />

          {campaignList.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              {campaignList.map((el, i) => {
                return (
                  <div key={i}>
                    <CampaignCard
                      name={el[5]}
                      description={el[6]}
                      creatorId={el[4]}
                      imageURL={el[7]}
                      id={campaigns[i]}
                      target={el[8]}
                      balance={el[1]}
                      ethPrice={ethPrice}
                    />
                  </div>
                );
              })}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
            </SimpleGrid>
          )}
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
        <HStack spacing={2}>
            <Box
                as={"span"}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: "-13px",
                  bottom: "-4px",
                  borderRadius:"50px",
                  w: "46px",
                  h: "46px",
                  bg: useColorModeValue("purple.300", "purple.900"),
                  zIndex: -1,
                }}
              >
                <Heading as="h2" size="lg">
                  How it works?
                </Heading>
              </Box>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            <Feature
              icon={<Icon as={FcDonate} w={10} h={10} />}
              title={"Create a Campaign for Fundraising"}
              text={
                "It’ll take only 2 minutes. Just enter a few details about the funds you are raising for."
              }
            />
            <Feature
              icon={<Icon as={FcShare} w={10} h={10} />}
              title={"Share your Campaign"}
              text={
                "All you need to do is share the Campaign with your friends, family and others. In no time, support will start pouring in."
              }
            />
            <Feature
              icon={<Icon as={FcMoneyTransfer} w={10} h={10} />}
              title={"Request and Withdraw Funds"}
              text={
                "The funds raised can be withdrawn directly to the recipient when 50% of the contributors approve of the Withdrawal Request."
              }
            />
          </SimpleGrid>
          <Divider marginTop="4" />
        </Container>
        

        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="milestone">
        <HStack spacing={2}>
            <Box
                as={"span"}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: "-13px",
                  bottom: "-4px",
                  borderRadius:"50px",
                  w: "46px",
                  h: "46px",
                  bg: useColorModeValue("purple.300", "purple.900"),
                  zIndex: -1,
                }}
              >
                <Heading as="h2" size="lg">
                  Our Milestone
                </Heading>
              </Box>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8} textAlign={"center"}>
            <Milestone 
                title={"TRUSTED BY"}
                number={"7.000"}
                descriptionText={"people over the world"}
              />
              <Milestone 
                title={"TOTAL FUNDRAISING AMOUNT"}
                number={"107 ETH"}
                descriptionText={"(VNĐ 9,388,963,805.54)"}
              />
              <Milestone 
                title={"TOTAL OF APPROVAL REQUEST"}
                number={"4.000"}
                descriptionText={"people who receive assistance"}
              />
          </SimpleGrid>
          <Divider marginTop="4" />
        </Container>
      </main>
    </div>
  );
}
