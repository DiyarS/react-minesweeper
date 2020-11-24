import styled from "styled-components";

export const AreaWrapper = styled.div`
  border: 1px solid red;
  ${"" /* display: flex; */}

  ${"" /* align-items: center; */}
`;

export const Row = styled.div`
  border: 1px solid green;
  display: flex;
  justify-content: center;
`;

export const Cell = styled.div`
  border: 1px solid;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
