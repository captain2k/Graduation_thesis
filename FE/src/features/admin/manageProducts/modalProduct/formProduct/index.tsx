import { useContext, useEffect, useState } from "react";
import { useAppDispatch } from "@/store/index";
import { Col, Row, Form } from "antd";
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextAreComponent,
} from "@/components/form";
import { eventEmitter, NotificationError } from "@/utils/index";
import { useForm } from "react-hook-form";
import {
  schema,
  FormData,
  handleSubmitEdit,
  handleSubmitCreate,
} from "./constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootState, useAppSelector } from "@/store/index";
import { ProductContext } from "../../constant";
import UploadComponent from "@/components/form/uploadComponent";
import lodash from 'lodash';
import { handleMultiPrevImageS3 } from "@/components/modal/modalChangeInfoUser/content/constant";
import MarkdownProduct from "../markdown";
import markDownApi from "@/api/markdown";

interface Props {
  isEdit: boolean;
}

const FormProduct = ({ isEdit }: Props) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const productSelected = useAppSelector(
    (state: RootState) => state.manageProduct.productSelected
  );

  const [imageDefault, setImageDefault] = useState([]);
  const [markdown, setMarkDown] = useState({html: '', text: ''});
  const [showMarkDown, setShowMarkdown] = useState(false)
 
  const categoryContext = useContext(ProductContext);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // use resolver to validate with yup
    resolver: yupResolver(schema),
    defaultValues: {
      id: productSelected?.id,
      name: productSelected?.name,
      description: productSelected?.description || '',
      price: productSelected?.price,
      stock_quantity: productSelected?.stock_quantity,
      category_id: productSelected?.category_id,
      images: productSelected?.images && JSON.parse(productSelected?.images),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const dataValue = lodash.cloneDeep(data);
      const { images } = dataValue;

      const imagesUpload = !lodash.isEmpty(images)
      ? await handleMultiPrevImageS3(images)
      : "";
      dataValue.images = typeof imagesUpload === 'string' ? imagesUpload : JSON.stringify(imagesUpload);
 
      // const { metadata } = await markDownApi.createMarkdown({
      //   contentHTML: markdown.html, 
      //   contentMarkdown: markdown.text,
      //   id: isEdit && productSelected?.markdown_id ? productSelected?.markdown_id : null,
      // })

      // const { id } = metadata;
      // dataValue.markdown_id = id;
      // dataValue.contentHTML = markdown.html;
      // dataValue.contentMarkdown = markdown.text;
      
      isEdit
        ? handleSubmitEdit(dataValue, dispatch, eventEmitter)
        : handleSubmitCreate(dataValue, dispatch, eventEmitter);
    } catch (error: unknown) {
      NotificationError(error)
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setMarkDown({html, text});
  }

  const debounceEditor = lodash.debounce(handleEditorChange, 300);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleClose = () => {
    eventEmitter.emit("cancel_modal");
  };

  useEffect(() => {
    const imageShow = productSelected?.images ? JSON.parse(productSelected?.images) : [];
    setImageDefault(imageShow);

    handleEditorChange({html: productSelected?.contentHTML || '', text: productSelected?.contentMarkdown || ''})
    
    setShowMarkdown(true)
  }, [productSelected])

  return (
    <div className="change__field-product">
      <Form
        name="change__field-product"
        onFinish={handleSubmit(onSubmit)}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col md={6} span={24}>
            Select Category <span className="required">*</span>
          </Col>
          <Col md={18} span={24}>
            <SelectComponent
              name="category_id"
              control={control}
              errors={errors}
              placeholder="Category"
              className="remove__border"
              options={categoryContext.categoryList.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              showSearch
              filterOption={(input, option) => {
                if(option && option.label) {
                  //@ts-ignore
                  return  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }
                return true;
                
              }}
            />
          </Col>
          <Col md={6} span={24}>
            Product Name <span className="required">*</span>
          </Col>
          <Col md={18} span={24}>
            <InputComponent
              name="name"
              control={control}
              errors={errors}
              placeholder="Name product"
              className="remove__border"
            />
          </Col>
          <Col md={6} span={24}>
            Product Image <span className="required">*</span>
          </Col>
          <Col md={18} span={24}>
            <UploadComponent
              name="images"
              control={control}
              errors={errors}
              className="remove__border"
              setValue={setValue}
              maxCount={5}
              defaultValue={imageDefault}
            />
          </Col>
          <Col md={6} span={24}>
            Price <span className="required">*</span>
          </Col>
          <Col md={18} span={24}>
            <InputComponent
              name="price"
              control={control}
              errors={errors}
              placeholder="Price product"
              className="remove__border"
              type="number"
              min={0}
            />
          </Col>
          <Col md={6} span={24}>
            Stock quantity <span className="required">*</span>
          </Col>
          <Col md={18} span={24}>
            <InputComponent
              name="stock_quantity"
              control={control}
              errors={errors}
              placeholder="Stock quantity product"
              className="remove__border"
              type="number"
              min={0}
            />
          </Col>
          <Col md={6} span={24}>
            Product description
          </Col>
          <Col md={18} span={24}>
            <TextAreComponent
              name="description"
              control={control}
              errors={errors}
              placeholder="Description product"
              className="remove__border"
              rows={4}
            />
          </Col>
          {/* <Col md={24} span={24}>
            Markdown
          </Col>
          <Col md={24} span={24}>
           <MarkdownProduct showMarkDown={showMarkDown} handleEditorChange={debounceEditor} markdown={markdown}/>
           
          </Col> */}
        </Row>
        <div className="button__footer">
          <ButtonComponent
            label="Cancel"
            className="btn__tab"
            loading={loading}
            type="default"
            onClick={handleClose}
          />
          <ButtonComponent
            htmlType="submit"
            label="Save changes ok"
            className="btn__submit btn__tab"
            loading={loading}
          />
        </div>
      </Form>
    </div>
  );
};

export default FormProduct;
