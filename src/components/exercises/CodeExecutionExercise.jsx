import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Play } from 'lucide-react';

const CodeExecutionExercise = ({ exercise, onAnswer, disabled }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        });
        setPyodide(pyodideInstance);
        setLoading(false);
      } catch (error) {
        console.error('Error loading Pyodide:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el intérprete de Python",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.onload = loadPyodide;
      document.head.appendChild(script);
    } else {
      loadPyodide();
    }
  }, []);

  const runCode = async () => {
    if (!pyodide || !code.trim()) return;

    try {
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      pyodide.runPython(code);

      const result = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(result);

      const isCorrect = result.trim() === exercise.expectedOutput.trim();
      onAnswer(isCorrect);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast({
        title: "Error en el código",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
          <span className="text-emerald-400 font-mono text-sm">editor.py</span>
          <Button
            onClick={runCode}
            disabled={disabled || loading || !code.trim()}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Ejecutar
          </Button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={disabled}
          placeholder="# Escribe tu código aquí..."
          className="w-full bg-slate-900 text-emerald-400 font-mono text-sm p-4 min-h-[200px] resize-none focus:outline-none"
        />
      </div>

      {output && (
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-xs mb-2">Salida:</div>
          <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {loading && (
        <div className="text-center text-slate-600">
          Cargando intérprete de Python...
        </div>
      )}
    </div>
  );
};

export default CodeExecutionExercise;