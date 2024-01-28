import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
// import './GridLayoutComponent.css'; // Import your custom CSS for styling

const ResponsiveGridLayout = WidthProvider(Responsive);

const DragableContainer = () => {
  const layout = [
    { i: 'item1', x: 0, y: 0, w: 2, h: 2 },
    { i: 'item2', x: 2, y: 0, w: 2, h: 4 },
    // Add more items as needed
  ];

  return (
    <div className="container ">
      {/* Regular div with Tailwind CSS classnames */}
      <div className="bg-gray-300 p-4">
        <p className=' relative z-10'>mwebweeee</p>
        <ResponsiveGridLayout resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]} className="layout" layouts={{ lg: layout }}>
          <div key="item1" className="bg-blue-500 absolute z-20">
            {/* Content for item 1 */}
            <p>yoola</p>
          </div>
          <div key="item2" className="bg-green-500">
            {/* Content for item 2 */}
          </div>
          {/* Add more items as needed */}
        </ResponsiveGridLayout>

        
      </div>
    </div>
  );
};

export default DragableContainer;
