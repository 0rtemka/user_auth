import { MouseEventHandler } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
    text: string;
    onClickFunc: MouseEventHandler;
}

export function Button({ text, onClickFunc: onClick }: ButtonProps) {
    return (
        <button className={styles.button} onClick={onClick}>{text}</button>
    )
}