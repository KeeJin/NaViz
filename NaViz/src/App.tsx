import DragAndDrop from "./components/DragAndDrop";
import Scene from "./Scene";

function App() {
  return (
    <div className="items-center justify-center flex h-screen w-full">
      <div className="h-screen w-full">
        <Scene />
      </div>
      <div className="h-screen w-96 bg-gray-800 text-white">
        <h1 className="text-4xl font-bold p-4">NaViz</h1>
        <p className="p-4">
          NaViz is a 3D visualization tool for understanding navigation
          algorithms. It is built using React Three Fiber and Drei.
        </p>
        <p className="p-4">
          To begin, drag and drop a point cloud map (.pcd) file here:
        </p>
        <div className="p-4">
          <input
            className="my-2"
            type="file"
            accept=".pcd"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("File uploaded: ", file);
              }
            }}
          />
          <DragAndDrop
            onFileUpload={(data) => console.log("File uploaded: ", data)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
