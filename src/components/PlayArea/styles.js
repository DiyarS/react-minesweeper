import styled from "styled-components";

export const AreaWrapper = styled.div`
  display: inline-block;
  margin-top: 1rem;
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
`;

export const CellWrapper = styled.div`
  border: 1px solid;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.showEmpty ? "lightgrey" : "#fff")};
`;
