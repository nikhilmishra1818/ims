class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props.product.category,
      name: props.product.name,
      imageURL: 'http://via.placeholder.com/200x200',
      checkURL: props.product.imageURL,
      price: props.product.price };

    this.checkImage.bind(this);
    this.checkImage();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product.category != this.state.category) {
      this.setState({ category: nextProps.product.category });
    }
    if (nextProps.product.name != this.state.name) {
      this.setState({ name: nextProps.product.name });
    }
    if (nextProps.product.price != this.state.price) {
      this.setState({ price: nextProps.product.price });
    }
    if (nextProps.product.imageURL != this.state.imageURL) {
      this.setState({ checkURL: nextProps.product.imageURL }, () => this.checkImage());
    }
  }

  checkImage() {
    let image = new Image();
    image.onerror = () => {
      this.setState({ imageURL: 'http://via.placeholder.com/200x200' });
    };
    image.onload = () => {
      this.setState({ imageURL: this.state.checkURL });
    };
    image.src = this.state.checkURL;
  }

  render() {
    return (
      React.createElement("div", { className: "ProductCard" },
      React.createElement("p", { className: "category" }, "Products \xBB ", this.state.category),
      React.createElement("p", { className: "name" }, this.state.name),
      React.createElement("img", { src: this.state.imageURL }),
      React.createElement("p", { className: "price" }, "from ", React.createElement("span", null, "$", this.state.price))));


  }}



class NewItemTab extends React.Component {
  constructor() {
    super();
    this.state = {
      formErrors: {
        category: false,
        name: false,
        price: false,
        imageURL: false } };


  }

  checkForm() {
    let category = document.getElementById('newItemForm-category').value;
    let name = document.getElementById('newItemForm-name').value;
    let price = document.getElementById('newItemForm-price').value;
    let imageURL = document.getElementById('newItemForm-imageURL').value;
    let product = { category: category, name: name, price: price, imageURL: imageURL };
    let errors = this.state.formErrors;
    category.length == 0 ? errors.category = true : errors.category = false;
    name.length == 0 ? errors.name = true : errors.name = false;
    price.length == 0 ? errors.price = true : errors.price = false;

    let image = new Image();
    image.onerror = () => {
      this.finalizeForm(false, product);
    };
    image.onload = () => {
      this.finalizeForm(true, product);
    };
    this.setState({ formErrors: errors });
    image.src = imageURL;
  }

  finalizeForm(isImageURLValid, product) {

    if (isImageURLValid == false) {
      let errors = this.state.formErrors;
      errors.imageURL = true;
      this.setState({ formErrors: errors });
    } else {
      this.props.addNewProduct(product);
    }
  }

  renderCategorySelections(inventory) {
    const categoryKeys = Object.keys(inventory.categories);
    const CKLength = categoryKeys.length;
    let options = [];

    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    for (let i = 0; i < CKLength; i++) {
      options.push(React.createElement("option", null, capitalize(categoryKeys[i])));
    }
    return options;
  }

  updateForm() {
    let category = document.getElementById('newItemForm-category').value;
    let name = document.getElementById('newItemForm-name').value;
    let price = document.getElementById('newItemForm-price').value;
    let imageURL = document.getElementById('newItemForm-imageURL').value;
    let errors = this.state.formErrors;
    if (this.props.formData.category != category) {
      errors.category = false;
    }
    if (this.props.formData.name != name) {
      errors.name = false;
    }
    if (this.props.formData.price != price) {
      errors.price = false;
    }
    if (this.props.formData.imageURL != imageURL) {
      errors.imageURL = false;
    }
    this.setState({ formErrors: errors });

    this.props.changeForm({ category: category, name: name, price: price, imageURL: imageURL });
  }

  render() {
    return (
      React.createElement("div", { className: "NewItemTab" },
      React.createElement("div", { className: "newItem-input" },
      React.createElement("h1", null, "Add A New Item"),
      React.createElement("p", null,
      React.createElement("label", null, "Category"),
      React.createElement("select", { className: this.state.formErrors.category == true ? 'formCheck-err' : '', id: "newItemForm-category", value: this.props.formData.category, onChange: () => this.updateForm() },
      React.createElement("option", null), this.renderCategorySelections(this.props.inventory))),


      React.createElement("p", null,
      React.createElement("label", null, "Product Name"),
      React.createElement("input", { className: this.state.formErrors.name == true ? 'formCheck-err' : '', type: "text", required: true, id: "newItemForm-name", value: this.props.formData.name, onChange: () => this.updateForm() })),

      React.createElement("p", null,
      React.createElement("label", null, "Price per Unit"),
      React.createElement("input", { className: this.state.formErrors.price == true ? 'formCheck-err' : '', type: "number", required: true, id: "newItemForm-price", value: this.props.formData.price, onChange: () => this.updateForm() })),

      React.createElement("p", null,
      React.createElement("label", null, "Image URL"),
      React.createElement("input", { className: this.state.formErrors.imageURL == true ? 'formCheck-err' : '', type: "text", required: true, id: "newItemForm-imageURL", value: this.props.formData.imageURL, onChange: () => this.updateForm(), placeholder: "Paste link here" })),

      React.createElement("button", { onClick: () => this.checkForm() }, "Add Product")),

      React.createElement("div", { className: "newItem-preview" },
      React.createElement("h1", null, "Preview"),
      React.createElement(ProductCard, { product: this.props.formData }))));





  }}



const ProductTableRow = props => {
  console.log();
  return (
    React.createElement("tr", null,
    React.createElement("td", null, props.product.name),
    React.createElement("td", null, "$", props.product.price),
    React.createElement("td", null, props.product.category),
    React.createElement("td", null, React.createElement("a", { target: "_blank", href: props.product.imageURL }, "View")),
    React.createElement("td", { className: "editButton" }, "edit")));


};

class ProductsTab extends React.Component {

  renderTableRows(inventory) {
    const categoryKeys = Object.keys(inventory.categories);
    const CKLength = categoryKeys.length;
    let listOfProducts = [];

    for (let i = 0; i < CKLength; i++) {
      let category = categoryKeys[i];
      listOfProducts = listOfProducts.concat(inventory.categories[category]);
    }

    let LOPlength = listOfProducts.length;
    if (LOPlength == 0) {
      return React.createElement("div", null, React.createElement("p", null, "There are currently no items in the inventory"));
    } else {
      let rows = [
      React.createElement("tr", null,
      React.createElement("th", null, "Product Name"),
      React.createElement("th", null, "Price"),
      React.createElement("th", null, "Category"),
      React.createElement("th", null, "Image"))];



      for (let i = 0; i < LOPlength; i++) {
        rows.push(React.createElement(ProductTableRow, { product: listOfProducts[i] }));
      }

      return rows;
    }
  }

  render() {
    return (
      React.createElement("div", { className: "ProductsTab" },
      React.createElement("h1", null, "Available Products List"),
      React.createElement("p", null, "Showing all available products:"),
      React.createElement("table", { className: "productTable" },
      this.renderTableRows(this.props.inventory))));



  }}




class MyRouter extends React.Component {

  route(active) {
    switch (active) {
      case 0:
        return React.createElement(NewItemTab, {
          inventory: this.props.inventory,
          formData: this.props.newItemFormData,
          changeForm: this.props.changeNewItemForm,
          addNewProduct: this.props.addNewProduct });

        break;
      case 1:
        return React.createElement(ProductsTab, { inventory: this.props.inventory });
        break;}

  }

  render() {
    return (
      React.createElement("div", { className: "MyRouter" },
      this.route(this.props.activeTab)));


  }}


const Sidebar = props => {
  return (
    React.createElement("div", { className: "Sidebar" },
    React.createElement("ul", null,
    React.createElement("li", { className: "add-new-item", onClick: () => props.changeTab(0) }, React.createElement("span", null, "Add New Item")),
    React.createElement("li", { className: props.activeTab == 1 ? 'active' : '', onClick: () => props.changeTab(1) }, "Products"),
    React.createElement("li", { className: props.activeTab == 2 ? 'active' : '', onClick: () => props.changeTab(2) }, "Categories"),
    React.createElement("li", { className: props.activeTab == 3 ? 'active' : '', onClick: () => props.changeTab(3) }, "Item Archive"))));



};

const Footer = () => {
  return (
    React.createElement("div", { className: "Footer" },
    React.createElement("p", null, "Current work-in-progress for an e-commerce dashboard.")));


};


class InventoryManagementApp extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 1,
      inventory: {
        categories: {
          dresses: [],
          shirts: [
          { category: "shirts", name: "Blue T-Shirt", price: "16.99", imageURL: "https://cdn.shopify.com/s/files/1/0797/0169/products/mockup-c6d64730_1024x1024.jpg" }],
          pants: [],
          accessories: [] } },


      newItemForm: {
        category: '',
        name: '',
        price: '',
        imageURL: '' } };


  }

  changeActiveTab(index) {
    this.setState({ activeTab: index });
  }

  changeNewItemForm(formData) {
    this.setState({ newItemForm: formData });
  }

  addNewProduct(product) {

    this.setState({ newItemForm: { category: '', name: '', price: '', imageURL: '' } });

    const decapitalize = string => {
      return string.charAt(0).toLowerCase() + string.slice(1);
    };

    product.category = decapitalize(product.category);
    let inventory = this.state.inventory;
    inventory.categories[product.category].push(product);

    this.setState({ inventory: inventory });
  }

  render() {
    return (
      React.createElement("div", { className: "InventoryManagementApp" },
      React.createElement("h2", { className: "header" }, React.createElement("i", { className: "icon-th-list" }), " Inventory Management Application Demo"),
      React.createElement("h1", { className: "title", onClick: () => this.changeActiveTab(1) }, "Inventory"),
      React.createElement("div", { className: "app-body" },
      React.createElement(Sidebar, { activeTab: this.state.activeTab, changeTab: this.changeActiveTab.bind(this) }),
      React.createElement(MyRouter, {
        activeTab: this.state.activeTab,
        inventory: this.state.inventory,
        newItemFormData: this.state.newItemForm,
        changeNewItemForm: this.changeNewItemForm.bind(this),
        addNewProduct: this.addNewProduct.bind(this) })),


      React.createElement(Footer, null)));


  }}



ReactDOM.render(
React.createElement(InventoryManagementApp, null),
document.getElementById('app'));