import {
  getPasswordRequirementStates,
  type PasswordRequirementState,
} from '../model/validation'
import styles from './PasswordRequirements.module.css'

type PasswordRequirementsProps = {
  id?: string
  password: string
}

function RequirementItem({
  label,
  isPassed,
}: Pick<PasswordRequirementState, 'label' | 'isPassed'>) {
  return (
    <li className={isPassed ? styles.requirementOk : styles.requirementPending}>
      <span className={styles.icon} aria-hidden="true">
        {isPassed ? '✓' : '•'}
      </span>
      <span>{label}</span>
    </li>
  )
}

export function PasswordRequirements({ id, password }: PasswordRequirementsProps) {
  const requirements = getPasswordRequirementStates(password)
  const titleId = id ? `${id}-title` : undefined

  return (
    <div id={id} className={styles.panel} aria-live="polite" aria-atomic="true">
      <p id={titleId} className={styles.title}>
        Требования к паролю
      </p>
      <ul className={styles.list} aria-labelledby={titleId}>
        {requirements.map((item) => (
          <RequirementItem key={item.key} label={item.label} isPassed={item.isPassed} />
        ))}
      </ul>
    </div>
  )
}
