export default function Spinner({ size = 32 }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: size, height: size }} />
        </div>
    );
}
