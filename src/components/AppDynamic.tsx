import dynamic from "next/dynamic";

const AppDynamic = dynamic(() => import("src/components/App"), {
  ssr: false,
});

export default AppDynamic;
