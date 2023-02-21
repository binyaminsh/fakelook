import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import NewPost from "../Posts/NewPost/NewPost";

import MainNavigation from "./MainNavigation";

const RootLayout = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const modalClosedHandler = () => {
    setIsModalVisible(false);
  };

  const modalVisibleHandler = () => {
    setIsModalVisible(true);
  };

  return (
    <Fragment>
      <MainNavigation onAddPostClicked={modalVisibleHandler} />
      {isModalVisible && <NewPost onModalClosed={modalClosedHandler} />}
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default RootLayout;
