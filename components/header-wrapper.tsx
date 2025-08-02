import { Navbar } from "./navbar";

const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Navbar/>
      {children}
    </>
  );
};

export default HeaderWrapper;