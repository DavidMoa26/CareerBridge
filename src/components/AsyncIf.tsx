import { ReactNode } from "react"

type Props = {
  condition: () => Promise<boolean>
  children: ReactNode
  otherwise?: ReactNode
}

export function AsyncIf({ children, condition, otherwise }: Props) {
  return (
    <SuspendedComponent condition={condition} otherwise={otherwise}>
      {children}
    </SuspendedComponent>
  )
}

async function SuspendedComponent({
  children,
  condition,
  otherwise,
}: Props) {
  return (await condition()) ? children : otherwise
}
