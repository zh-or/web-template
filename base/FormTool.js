export function getRule(msg, trigger) {
    trigger = trigger || 'blur';
    if (msg && typeof msg === 'function') {
        return [
            {required: true, validator: msg, trigger: trigger}
        ]
    }

    msg = msg || '请输入';

    return [
        {required: true, message: msg, trigger: trigger}
    ]
}
