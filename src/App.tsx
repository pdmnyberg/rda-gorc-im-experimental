import { Tree } from "./components/Tree.tsx";
import Layout from "./components/Layout";
import "@xyflow/react/dist/style.css";
import "./App.css";

const App = () => {
  return (
      <Layout>
          <div className="tree-container">
              <Tree />
          </div>
      </Layout>
  );
};

export default App;
