import { Flex, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <Flex direction="column" align="center" justify="center" h="100%">
      <Title order={1}>Music Tools</Title>
      <Text>A simple music toolbox for the musician</Text>
    </Flex>
  );
}
