
import CustomAvatar from './custom-avatar';
import { Text } from './text';

type PropsSelect = {
    name:string,
    avatarUrl?: string;
    shape?: "circle" | "square";
}

const SelectOptionWithAvatar = ({avatarUrl, name, shape}: PropsSelect) => {
  return (
    <div
        style={{
            display:"flex",
            alignItems:"center",
            gap:"8px"
        }}
    >
      <CustomAvatar shape={shape} name={name} src={avatarUrl}/>
      <Text>{name}</Text>
    </div>
  )
}

export default SelectOptionWithAvatar
