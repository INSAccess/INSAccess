import React from 'react'
import { gsap } from 'gsap'
import './NavBar.scss'

const { useRef, useState, useEffect, createRef } = React

/**
 * NavBar component
 * The items prop should be a list of objects with the fields {name, color, href}
 * @component
 * @returns {JSX.Element} 
 */
const NavBar = ({ setPage, items }) => {
  const $root = useRef();
  const $indicator1 = useRef();
  const $indicator2 = useRef();
  const $items = useRef(items.map(createRef));
  const [active, setActive] = useState(0);

  const animate = () => {
    const menuOffset = $root.current.getBoundingClientRect();
    const activeItem = $items.current[active].current;
    const { width, height, top, left } = activeItem.getBoundingClientRect();

    const settings = {
      x: left - menuOffset.x,
      y: top - menuOffset.y,
      width: width,
      height: height,
      backgroundColor: items[active].color,
      ease: 'elastic.out(.7, .7)',
      duration: .8 };


    gsap.to($indicator1.current, {
      ...settings });


    gsap.to($indicator2.current, {
      ...settings,
      duration: 1 });

  };

  useEffect(() => {
    animate();
    window.addEventListener('resize', animate);

    return () => {
      window.removeEventListener('resize', animate);
    };
  }, [active]);

  return (
    React.createElement("div", {
      ref: $root,
      className: "menu" },

    items.map((item, index) => 
    React.createElement("a", {
      key: item.name,
      ref: $items.current[index],
      className: `item ${active === index ? 'active' : ''}`,
      onClick: () => {setPage(item.href); setActive(index)}
    },

    item.name)), 


    React.createElement("div", {
      ref: $indicator1,
      className: "indicator" }),

    React.createElement("div", {
      ref: $indicator2,
      className: "indicator" })));



};

export default NavBar;