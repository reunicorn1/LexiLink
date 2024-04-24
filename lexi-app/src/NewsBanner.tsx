import { Box, Text } from "@chakra-ui/react";

const NewsBanner = () => {
  return (
    <Box
      w="100%"
      overflow="hidden"
      whiteSpace="nowrap"
      position="relative"
      bg="brand.700"
      mt="10px"
    >
      <Box
        as="p"
        display="inline-block"
        mt="10px"
        mb="10px"

      >
        <Text color="white">LAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAHBLAH</Text>
      </Box>
    </Box>
  );
};

export default NewsBanner;
