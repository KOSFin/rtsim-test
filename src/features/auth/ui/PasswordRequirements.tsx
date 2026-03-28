import {
  getPasswordRequirementStates,
  type PasswordRequirementState,
} from '../model/validation'
import styles from './PasswordRequirements.module.css'

type PasswordRequirementsProps = {
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

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = getPasswordRequirementStates(password)

  return (
    <div className={styles.panel} aria-live="polite">
      <p className={styles.title}>Требования к паролю</p>
      <ul className={styles.list}>
        {requirements.map((item) => (
          <RequirementItem key={item.key} label={item.label} isPassed={item.isPassed} />
        ))}
      </ul>
    </div>
  )
}
