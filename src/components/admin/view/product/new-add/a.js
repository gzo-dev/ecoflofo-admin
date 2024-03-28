<div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 col-md-9 col-lg-6">
            <h2 className="mt-30 page-title">Sản phẩm</h2>
          </div>
          <div className="col-lg-5 col-md-3 col-lg-6 back-btn mb-3">
            <Button variant="contained" onClick={(e) => this.handleBack()}>
              <i className="fas fa-arrow-left" /> Back
            </Button>
          </div>
          <br />
        </div>
        <ol className="breadcrumb mb-30">
          <li className="breadcrumb-item">
            <a href="/">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/product/create">Products</a>
          </li>
          <li className="breadcrumb-item active">Add Product</li>
        </ol>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="card card-static-2 mb-30">
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="form-group">
                    <label className="form-label">Thể loại*</label>
                    <MainCategorylist onSelectCategory={this.handleCategory} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="card card-static-2 mb-30">
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="form-group">
                    <label className="form-label">Thể loại con*</label>
                    <SubCategorylist
                      state={getList}
                      onSelectSubCategory={this.handleSubCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={
            this.state.blockhide ? { display: "block" } : { display: "none" }
          }
        >
          {isLoaded ? <Loader /> : ""}
          <div className="col-lg-12 col-md-12">
            <div className="card card-static-2 mb-30">
              <div className="card-title-2">
                <h4>Thêm sản phẩm</h4>
              </div>
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="row">
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Tên sản phẩm*</label>
                        <input
                          style={{marginTop: 12}}
                          type="text"
                          className="form-control"
                          placeholder="Tên sản phẩm"
                          name="name"
                          value={this.state.name}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Địa chỉ*</label>
                        <Box sx={{ width: "100%" }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Địa chỉ</InputLabel>
                            <Select
                              style={{height: 32}}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              // value={age}
                            // onChange={handleChange}
                            >
                              {/* eslint-disable-next-line */}
                              {this.state.listProvince.map((item) => ({
                                ...item,
                                value: item.province_id,
                                label: item.province_name,
                              })).map((item, key) => <MenuItem value={item.value} key={key}>{item.label}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Brand*</label>
                        <input
                          style={{marginTop: 12}}
                          type="text"
                          className="form-control"
                          placeholder="Brand Name"
                          name="brand"
                          value={this.state.brand}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                   
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Ảnh đại diện*</label>
                        <input
                          style={{marginTop: 12}}
                          type="file"
                          className="form-control"
                          name="image"
                          onChange={this.onFileChange}
                        />
                      </div>
                    </div>
                    {/* new */}
                    <div className="col-lg-12 col-md-12 mt-3">
                      <div className="form-group">
                        <label className="form-label">Ảnh sản phẩm*</label>
                        <input
                          style={{marginTop: 12}}
                          className="form-control"
                          type="file"
                          multiple
                          name="files"
                          onChange={this.fileSelectedHandler}
                        />
                        <br />
                        <div
                          className={
                            "d-flex align-items-center g-10 mr-2 flex-wrap mb-3"
                          }
                        >
                          {this.state.previewImage.length > 0 &&
                            this.state.previewImage.map((item, key) => (
                              <div style={{ position: "relative" }}>
                                <img
                                  key={key}
                                  src={item.preview}
                                  className={"mr-3 mb-3"}
                                  style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: 10,
                                    objectFit: "cover",
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    this.setState({
                                      previewImage:
                                        this.state.previewImage.filter(
                                          (item2) => item2.id != item.id
                                        ),
                                    });
                                    this.setState({
                                      files: [...this.state.files].filter(
                                        (item2) => item2.lastModified != item.id
                                      ),
                                    });
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ))}

                          {this.state.newAddImage.map((item, key) => <div key={key} style={{ position: "relative" }}>
                            <img
                              src={item.previewUrl}
                              className={"mr-3 mb-3"}
                              style={{
                                width: 130,
                                height: 130,
                                borderRadius: 10,
                                objectFit: "cover",
                              }}
                            />
                            <button
                              onClick={() => {
                                this.setState({ newAddImage: this.state.newAddImage.filter((item2) => item2.id !== item.id) });
                              }}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                              }}
                            >
                              X
                            </button>
                          </div>)
                          }
                          <div
                            className={"mr-3 mb-3"}
                            style={{
                              width: 130,
                              height: 130,
                              borderRadius: 10,
                              objectFit: "cover",
                              backgroundColor: "#f2f0f5",
                              marginLeft: 12,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative"
                            }}
                          >
                            <input style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, opacity: 0 }} type="file" onChange={(e) => {
                              e.persist()
                              this.setState(prev => ({ newAddImage: [...prev.newAddImage, { id: v4(), previewUrl: URL.createObjectURL(e.target.files[0]), image: e.target.files[0] }] }))
                            }} />
                            Thêm ảnh
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                  </div>
                  <div className="row" style={{ paddingTop: "2rem" }}>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Trạng thái*</label>
                        <select
                          style={{marginTop: 12}}
                          id="status"
                          name="status"
                          className="form-control"
                          value={this.state.status}
                          onChange={(e) => this.handleChange(e)}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Cost*</label>
                        <input
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          name="buyerPrice"
                          value={this.state.buyerPrice}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Price*</label>
                        <input
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          name="price"
                          value={this.state.price}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
               
                    <div
                      className="col-lg-1 col-md-1"
                      style={{}}
                    >
                      <div className="form-group">
                        <label className="form-label">Discount(%)*</label>
                        <input
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          name="discountPer"
                          value={this.state.discountPer}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-1 col-md-1"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Discount Price*</label>
                        <input
                          
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          disabled
                          name="discount"
                          value={this.state.discount}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-1 col-md-1"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Total *</label>
                        <input
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          disabled
                          name="total"
                          value={this.state.total}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-2 col-md-2"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Grand Total *</label>
                        <input
                          style={{marginTop: 12}}
                          type="number"
                          className="form-control"
                          disabled
                          name="grand_total"
                          value={this.state.grand_total}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ paddingTop: "2rem" }}>
                    <div className="form-group" style={{ opacity: 0 }}>
                      <label className="form-label">Sort Description*</label>
                      <textarea
                        style={{marginTop: 12}}
                        rows="4"
                        cols="100"
                        className="form-control"
                        name="sortDesc"
                        value={this.state.sortDesc}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">Mô tả chi tiết*</label>
                        <RichTextEditor
                          content={this.state.content}
                          handleContentChange={this.handleContentChange}
                          placeholder="insert text here..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button_price">
                    {/* <div className="form-group">
                      <Button
                        className="checkprice"
                        variant="contained"
                        onClick={() => this.handleCheckPrice()}
                      >
                        Preview
                      </Button>
                    </div> */}
                    <div
                      className="form-group"
                      style={
                        this.state.toggle
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <button
                        className="save-btn hover-btn"
                        type="submit"
                        onClick={async (e) => {
                          const result = await this.handleSubmitMoreImage(e);
                          setTimeout(() => {
                            this.handleSubmit(e, result.data);
                          }, 5000);
                        }}
                      >
                        Add New Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    