import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

   function capitalizeFirstLetter(string) {
    if (!string) return string; 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getProductName(productId){
    const decodedProductName = decodeURIComponent(productId).replace(/%20/g, ' ');
    const productName = decodedProductName.split('-')[0];
    return productName;
  }

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(
    pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSnippets.length - 1;
      if(snippet !== 'category' && snippet !== 'brand'){
        snippet = getProductName(snippet);
      }
      if(snippet == 'undefined' || snippet == null) return null;
      return (
        <Breadcrumb.Item key={url}>
          {isLast ? (
            <span style={{ color: 'black' }}>{ capitalizeFirstLetter(snippet)}</span>
          ) : (
            <Link to={url}>{ capitalizeFirstLetter(snippet)}</Link>
          )}
        </Breadcrumb.Item>
      );
    })
    .filter(item => item !== null) 
  );

  return (
    <Breadcrumb separator=">" style={{ margin: '16px' }}>
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
